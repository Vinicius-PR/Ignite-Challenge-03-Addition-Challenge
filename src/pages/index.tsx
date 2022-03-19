import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Link from "next/link";
import { useCallback, useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination } : HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination);
  
  const handleLoadMorePosts = useCallback(async () => {
    const response = await fetch(posts.next_page);
    const data = await response.json();

    setPosts(state => ({
      ...state,
      ...data,
      results: [...state.results, ...data.results],
    }));
  }, [posts]);

  return(
    <>
      <Header/>

      <Head>
        <title>Home | Posts</title>
      </Head>

      <main className={`${styles.content} ${commonStyles.container}`}>
        {posts.results.map(post => (
          <section key={post.uid}>

            <Link href={`post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>              
              </a>
            </Link>
            
              <div className={commonStyles.information}>
                <div>
                  <FiCalendar/>
                  <time>{format(new Date(post.first_publication_date), 'd MMM yyy', {
                    locale: ptBR,
                  })}</time>
                </div>
                <div>
                  <FiUser/>
                  <span>{post.data.author}</span>
                </div>
              </div>
        </section>
        ))}

        {posts.next_page && (
          <div className={styles.loadMore}>
            <button
              onClick={handleLoadMorePosts}
              className={styles.loadButton}
              type="button"
            >
              Carregar mais posts
            </button>
          </div>
        )}

      </main>
    </>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const Prismic = require('@prismicio/client');

  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
    ,{
      pageSize: 1
    });
  
  return {
    props: {
      postsPagination: postsResponse
    }
  }

}
