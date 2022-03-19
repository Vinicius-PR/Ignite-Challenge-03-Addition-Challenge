# Ignite Challenge 3 - Creating a project from zero

This project consist in create a blog using NextJS. The layout is on Figma and was done by a designer. My job is to implement all the styles and logic of a blog. The files that I received was empty and I had to implement:

* All the styles, global and local;
* import font from Google fonts;
* Do the pagination logic;
* Calculate the time estimated of reading the current post;
* Work `getStaticProps` and `getStaticPaths`;
* Format dates using `data-fns`;
* Use `react-icons`;
* Request HTTP with `fetch`;

# Prismic

One of the features that this blog uses is Prismic. It is where the blog will be saved. It is a Headless CMS. In Prismic had to create a custom type of `post` with 6 main field and 2 sub-field:

* slug:
	* Type: UID;
	* Description: A unique identifier of each post. Can receive a	 manual value or generated automatic from the text. This field will be used to do the navigation.
* title:
	* Type: Key Text;
	* Description: Input of strings. This field is the title of the post;
* subtitle:
	* type: Key Text;
	* Description: Input of strings. This field is the subtitle of the post; 
* author:
	* type: Key Text;
	* Description: Input of strings. This field represent the Author;
* banner:
	* type: Image;
	* Description: It is the image of the post. It receives as configuration the Name, Width and Height in pixels.
* Content
	* type: Group;
	* Description: This camp is the body of the post. This field is divided buy 2 fields. The `heading` and `body`.
	* Internal fields:
		* heading
			* type: Rich Text
			* Configurations: Select all except the pre, h1, h2, h3, h4, h5 and h6. Mark the "Allow target blank for links".
		* Description: Input rich text (html). Receive manual values.


Also must configure the file `.env.local` with the variable PRISMIC_API_ENDPOINT. The value is the url API key, selecting JS as the technology. This url API can be found in API & Security.

# What I had to edit?

With the dependencies installed and Prismic configured, I had to edit the following files:

-   src/pages/_document.tsx;
-   src/pages/index.tsx;
-   src/pages/home.module.scss;
-   src/pages/post/[slug].tsx;
-   src/pages/posts/post.module.scss;
-   src/components/Header/index.tsx;
-   src/components/Header/header.module.scss;
-   src/styles/global.scss;
-   src/styles/common.module.scss;

## pages/_document.tsx

In this file I had to import the font `Inter` from Google fonts. The sizes are Regular, Semi Bold and Bold.

## pages/index.tsx

This is where all the post will be rendered and the Header component. The list uses the title, subtitle, slug, publication date and author of each post. Each will have a link that when clicked, must go to `/post/slugofthepost` where `slugofthepost` is the slug of each post.

Also must have a button "Carregar mais post" if exist more post to list. To do it, the value of `next_page`returned from Prismic was used.

In the end, the page must be statically generated. To achieve this, I had to use `getStaticProps` to get the data from Prismic and fill the prop `postsPagination` as the interface. Is mandatory to use query method of Prismic.

## pages/home.module.scss

Here is where the styles of the principal page. The Home page.

## pages/post/[slug].tsx

Here also have to render the Header Component.
After Header, must show the Image of the file. Then the post, respecting the style and structure of the Figma. The information shown is the title, publication date, author, time estimated to read (will explain), author and the content.

The content must be iterated to display the all heading and the text of each heading.

To calculate the time estimated to read, must calculate the amount of words of the post, divide by the average of words that a human can read per minute and round it up. In this challenge, presupposes that a human read 200 words per minute. Example:

Number of words in a post: 805.
average of words a human can read: 200
Time estimated is: 805/200 = 4,025. Rounding it up: 5 is the final value.

To get the total number of the words in a content (heading and body), I used the reduce method. Counted the numbers of words in heading and body separately. Then, put the amount into total variable, returning it in the end.

The page must be statically generated. So `getStaticProps` was used to get the data **post** form Prismic as the interface suggest. Here had to use [getByUID](https://prismic.io/docs/technologies/query-helper-functions-javascript#getbyuid) method from prismic. More detail in the documentation.

Also had to use `getStaticPaths`to generate the static pages of some pages and set the `fallback`as true, so that the rest is generated at the time of the request. Here is mandatory to use [query](https://prismic.io/docs/technologies/query-a-single-type-document-javascript) of Prismic.

To display the body of the content I used the `dangerouslySetInnerHTML`so the text will display formatted.



## posts/post.module.scss

In this file is where all the style of the page post is.

## components/Header/index.tsx

Here is where the Header components is.
It must render the logo that I got from figma. Exported as svg. This image is used with a Link component from 'next/link' that points to home page (href = '/'). The image must be save inside public folder. It alts property must be 'logo' to test script find it.

## components/Header/header.module.scss

File with the styles of the Header component.

## styles/global.scss

File with Global styles. It is where the css variables live.

## styles/common.module.scss

Here have the common styles of the components, like maximum width.

# Conclusion

This was a not easy challenge. But I learned about Dynamic Routes with NextJS. Using the [slug].tsx I can server one file to all the post that is returned from Prismic. Also I practice a lot of CSS and Next logic, generating pages statically.

Ignite bootcamp - React/Next course. Teacher: Diego Fernandes.