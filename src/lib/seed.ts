
import { Firestore, collection, writeBatch } from "firebase/firestore";
import { blogPosts } from "./placeholder-data";

export async function addBlogPosts(db: Firestore) {
    const postsCollection = collection(db, "blog_posts");
    const batch = writeBatch(db);

    blogPosts.forEach(post => {
        // We use the post slug as the document ID for cleaner URLs
        const docRef = collection(db, 'blog_posts').doc;
        const postData = { ...post };
        // The placeholder data has an 'id' field we don't need in the document itself
        delete (postData as any).id;
        batch.set(docRef(), postData);
    });

    try {
        await batch.commit();
        console.log("Successfully seeded blog posts!");
    } catch (error) {
        console.error("Error seeding blog posts: ", error);
    }
}
