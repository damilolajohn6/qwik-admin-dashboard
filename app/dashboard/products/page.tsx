import { listProducts } from "@/api/products";

export default async function ProductsPage() {

    const products = await listProducts();


    return <div>
        {products.map((product) => (
            <div key={product.id}>{product.name}</div>
        ))}
    </div>
}
