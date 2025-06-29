import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const data = await req.json();

  try {
    const updated = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating product.' }, { status: 500 });
  }
} 