# Free Google Search Setup for Sakith Tech Store

Google Search Console is free. It helps Google discover and inspect the published storefront, but it cannot guarantee a first-page ranking or an immediate result.

## After the SEO checkpoint is published

Open [Google Search Console](https://search.google.com/search-console) and sign in with the store owner's Google account. Choose **URL prefix** and enter the complete published URL:

```text
https://sakithtech-dmref9mn.manus.space/
```

Google will ask for verification. Use the available HTML tag or Google Analytics verification method. If Search Console provides a verification meta tag, add that tag inside `client/index.html`, create a new checkpoint, and publish again. Then return to Search Console and click **Verify**.

After verification, open **Sitemaps** in the left menu and submit:

```text
sitemap.xml
```

Use **URL inspection**, enter the homepage URL, click **Test live URL**, and then click **Request indexing**. Repeat this later for important category URLs if category routes are added.

## Important expectations

The homepage title and description, canonical URL, robots.txt, sitemap.xml, Open Graph tags, Twitter tags, and Store structured data are included in the SEO-ready project. These assets become live only after the SEO checkpoint is published from the Management UI. Google may take time to crawl and index the site. The free process improves discoverability but does not guarantee ranking position.
