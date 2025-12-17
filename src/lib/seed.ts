
import { Firestore, collection, writeBatch, doc } from "firebase/firestore";
import { blogPosts } from "./placeholder-data";

export async function addBlogPosts(db: Firestore) {
    const postsCollection = collection(db, "blog_posts");
    const batch = writeBatch(db);

    blogPosts.forEach(post => {
        // Create a new document reference with an auto-generated ID
        const newDocRef = doc(postsCollection);
        const postData = { ...post };
        // The placeholder data has an 'id' field we don't need in the document itself
        delete (postData as any).id;
        batch.set(newDocRef, postData);
    });

    try {
        await batch.commit();
        console.log("Successfully seeded blog posts!");
    } catch (error) {
        console.error("Error seeding blog posts: ", error);
    }
}
