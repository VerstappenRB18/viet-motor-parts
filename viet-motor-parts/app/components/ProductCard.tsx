import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

export default function productCard() {
  return (
    <div className="bg-brand-500 w-[330px] rounded-2xl shadow-xl">
      <a href="#">
        <Image
          className="rounded-t-lg"
          src="https://placehold.co/330x200/webP"
          alt="product image"
          width={330}
          height={200}
        />
      </a>
      <div className="flex flex-col justify-between gap-3 px-5 pt-3 pb-5">
        <Link href="#">
          <h5 className="text-xl font-semibold tracking-tight line-clamp-2" id="productName">
            MOTORBIKE 4T 5W30 MOLYGEN SCOOTER LIQUI MOLY
          </h5>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold" id="price">
            300.000đ
          </span>
          <Button title="Add to Cart" link="/cart" />
        </div>
      </div>
    </div>
  );
}
