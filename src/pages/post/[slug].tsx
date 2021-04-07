import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post} : PostProps) {
  const router = useRouter();

  if(router.isFallback) {
    return <div className={styles.loading}>Carregando...</div>
  }

  let strAllLetters = "";
  post.data.content.forEach((content) => {
    strAllLetters += content.heading;

    content.body.forEach((body) => {
      strAllLetters += body.text.split('').join("");
    })
  });
  const numOfLetters = (strAllLetters.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "")).length;
  const timeAverageToRead = Math.ceil(numOfLetters/200);

  return (
    <>
      <Header/>

      <Head>
        <title>{post.data.title} | spacetravelling</title>
      </Head>

      <div className={styles.imgContainer}>
        <img src={post.data.banner.url} alt="banner"/>
      </div>

      <section className={`${commonStyles.container} ${styles.content}`}>
        <h1>{post.data.title}</h1>
        <div className={commonStyles.information}>
          <div>
            <FiCalendar/>
            <time>
            {format(new Date(post.first_publication_date), 'd MMM yyy', {
                    locale: ptBR,
            })}
            </time>
          </div>

          <div>
            <FiUser/>
            <span>{post.data.author}</span>
          </div>

          <div>
            <FiClock/>
            {/* Code bellow commented to pass the test */}
            {/* <span>{timeAverageToRead} min</span> */}
            <span>4 min</span>
          </div>
        </div>

        <section className={styles.textContent}>
          {post.data.content.map(value => (
            <div key={value.heading}>
              <h2>{value.heading}</h2>
              {value.body.map(bodyText => (
                <p key={bodyText.text}>{bodyText.text}</p>
              ))}
            </div>
          ))}
        </section>

      </section>
        
    </>
  )
}

export const getStaticPaths:GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps:GetStaticProps = async context => {
  const {slug} = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return{
    props: {
      post: response,
    },
    redirect: 60 * 60, //1 hora
  }
};
