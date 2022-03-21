import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router'

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Comments from '../../components/Comments';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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

  console.log(post);

  if(router.isFallback) {
    return <div className={styles.loading}>Carregando...</div>
  }

  const totalWords = post.data.content.reduce((total, contentItem) => {

    const heading_count_words = contentItem.heading.split(' ').length;
    total += heading_count_words;

    // Array with numbers of words in each paragraph.
    const words_array_amount = contentItem.body.map(item => item.text.split(' ').length);

    words_array_amount.map((value) => {
      total += value;
    })
    return total;
  }, 0);

  const readTime = Math.ceil(totalWords / 200);

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
            {format(new Date(post.first_publication_date), "d MMM yyy", {
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
            <span>{readTime} min</span>
          </div>
        </div>

        <div className={commonStyles.edited_date}>     
          <i>
            {format(new Date(post.last_publication_date), "'*editato em 'd MMM yyy', às 'H:m", {
                locale: ptBR,
            })}
          </i>
        </div>

        <section className={styles.textContent}>
          {post.data.content.map(value => (
            <div key={value.heading}>
              <h2>{value.heading}</h2>
              
              <main
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(value.body),
                }}
              />
            </div>
          ))}
        </section>
        <div>

        <Comments/>
        </div>

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
