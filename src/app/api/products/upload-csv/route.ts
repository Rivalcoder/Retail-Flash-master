import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { parse } from 'csv-parse/sync';

export const runtime = 'edge'; // or 'nodejs' if you need Node APIs

export async function POST(req: Request) {
  await dbConnect();

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ message: 'CSV file is required.' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const csvString = Buffer.from(arrayBuffer).toString('utf-8');

  let records;
  try {
    records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
    });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid CSV format.' }, { status: 400 });
  }

  let added = 0, updated = 0;
  for (const record of records) {
    const { name, price, description, category, stock, imageUrl } = record;
    if (!name || !price) continue;
    const existing = await Product.findOne({ name });
    if (existing) {
      await Product.updateOne({ name }, { $set: { price, description, category, stock, imageUrl } });
      updated++;
    } else {
      await Product.create({ name, price, description, category, stock, imageUrl });
      added++;
    }
  }

  return NextResponse.json({ message: 'CSV processed.', added, updated });
} 