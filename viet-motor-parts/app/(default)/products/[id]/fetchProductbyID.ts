import { Product } from "../page";


export async function fetchProductbyID(id: string): Promise<Product> {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`, { cache: "no-store"});
        if (!res.ok) {
            console.error(`Failed to fetch product with ID: ${id}, Status: ${res.status}`);
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();

        return data.data;
    } catch (error) {
        console.error(`Error fetching product with ID: ${id}`, error);
        throw error;
    }
}
