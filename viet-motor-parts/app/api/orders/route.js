import dbConnect from '@/app/lib/db';
import Order from '@/app/lib/models/order';
import { verifyAdminToken } from '@/app/lib/middleware/auth';

export async function GET(request) {
  await dbConnect();

  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized access: Missing Authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin token
    try {
      verifyAdminToken({ headers: { authorization: authHeader } }); // Pass headers to middleware
    } catch (error) {
      console.error('Unauthorized admin:', error.message);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all orders
    const orders = await Order.find({});
    return new Response(
      JSON.stringify({ success: true, data: orders }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { customer_name, phone_number, address, order_details, total_amount, payment_method } = body;

    // Validate required fields
    if (!customer_name || !phone_number || !address || !order_details || !total_amount || !payment_method) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required order fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Iterate through order_details and add product_name
    const enrichedOrderDetails = order_details.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name, // Add product_name directly
      quantity: item.quantity,
      price: item.price,
    }));

    // Create a new order
    const newOrder = new Order({
      customer_name,
      phone_number,
      address,
      total_amount,
      payment_method,
      order_details: enrichedOrderDetails, // Include enriched details
    });
    const savedOrder = await newOrder.save();

    return new Response(
      JSON.stringify({ success: true, data: savedOrder }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

