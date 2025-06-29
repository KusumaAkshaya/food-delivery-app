'use client'

import Image from 'next/image';
import Link from 'next/link';

interface Props{
    image: string;
    label: string;
}

export default function DishCard({image, label} : Props)
{
    return(
        <div className="flex flex-col items-center justify-center " >
            <div className="w-30 h-30 rounded-full overflow-hidden shadow-md hover:scale-102 " >
                <Link href={`search?query=${label}`} ><Image src={image} alt={label} width={190} height={190} className="object-cover w-full h-full hover:bg-orange-100" /></Link>
            </div>
            <p>{label}</p>
        </div>
    )
}