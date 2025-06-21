'use client'

import Image from 'next/image';

interface Props{
    image: string;
    label: string;
}

export default function DishCard({image, label} : Props)
{
    return(
        <div className="flex flex-col items-center justify-center" >
            <div className="" >
                <Image src={image} alt={label} width={112} height={112} className="" />
            </div>
            <p>{label}</p>
        </div>
    )
}