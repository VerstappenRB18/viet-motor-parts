"use client"

import { Input } from "@/app/components/shadcn/input";
import { Label } from "@/app/components/shadcn/label";
import { Textarea } from "@/app/components/shadcn/textarea";
import VietnameseAddressInput from "@/app/components/VietnameseAddressInput";
import PaymentMethod from "./paymentMethod";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const CheckoutProductList = dynamic(() => import("@/app/components/CheckoutProductList"), { ssr: false });
const OrderSummary = dynamic(() => import("@/app/components/OrderSummary"), { ssr: false });


export default function CheckoutPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const customer_name = formData.get("name") as string;
        const phone_number = formData.get("pnumber") as string;
        const address = `${formData.get("address")}, ${formData.get("ward")}, ${formData.get("district")}, ${formData.get("city")}`;
        const additional_notes = formData.get("addNotes") as string;
        const payment_method = formData.get("paymentMethod") as string;
        const cartItems = formData.get("cartItems") as string;
        const total_amount = formData.get("total") as string;

        const order_details = JSON.parse(cartItems).map((item: any) => ({
            product_id: item.id,
            quantity: item.amount,
            price: item.price,
        }));

        setLoading(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer_name,
                    phone_number,
                    address,
                    additional_notes,
                    order_details,
                    total_amount,
                    payment_method,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Failed to process your order.");
            } else {
                // Store phone_number in local storage or session
                setSuccess("Order placed successfully")
                setError("")
                localStorage.setItem("shoppingCart", "[]")
                localStorage.setItem("total", "0")
                localStorage.setItem("orderID",data.data._id)

                // Redirect to the order details page
                router.push(`/checkout/success`);
            }
        } catch (err) {
            console.error("Error placing order:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div >
            <form id="checkout" action={handleSubmit} className="container grid min-h-screen grid-cols-1 gap-5 mx-auto my-5 lg:grid-cols-9">
                <div className="grid gap-5 lg:col-span-6">
                    <div className="bg-brand-600 rounded-xl p-5">
                        <h1 className="p-5 text-2xl font-bold">Shipping Details</h1>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold">Name</Label>
                            <Input type="text" id="name" name="name" required className="w-full p-2 shadow-2xl" placeholder="e.g Nguyễn Văn A" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pnumber" className="font-bold">Phone Number</Label>
                            <Input
                                type="text"
                                id="pnumber"
                                name="pnumber"
                                required
                                pattern="^0[3|5|7|8|9]\\d{8}$"
                                className="w-full p-2"
                                placeholder="e.g 0376543210"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold">Email</Label>
                            <Input type="email" id="email" name="email" required className="w-full p-2" placeholder="e.g ABG@hotmail.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="font-bold">Address</Label>
                            <Input type="text" id="address" name="address" required className="w-full p-2" placeholder="e.g. 702 Nguyễn Văn Linh" />
                        </div>
                        <div className="space-y-2">
                            <VietnameseAddressInput />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="addNotes" className="font-bold">Additional Notes</Label>
                            <Textarea
                                id="addNotes"
                                name="addNotes"
                                className="w-full p-2 overflow-y-scroll border-none resize-y max-h-24 bg-brand-500 placeholder:text-slate-300"
                                placeholder="e.g. No need to call before delivering"
                            />
                        </div>
                        <PaymentMethod />
                    </div>
                </div>
                <div className="grid order-1 col-start-1 grid-rows-3 gap-5 lg:col-span-3 lg:col-start-7 lg:order-2">
                    <div className="row-span-2 h-full">
                        <CheckoutProductList />
                    </div>
                    <div className="flex flex-col justify-end">
                        <OrderSummary location="checkout" disabled={loading} />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
            </form>
        </div>
    );
}