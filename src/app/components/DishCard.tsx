'use client'

import Image from 'next/image';

interface Props{
    image: string;
    label: string;
}

export default function DishCard({image, label} : Props)
{
    return(
        <div className="flex flex-col items-center justify-center " >
            <div className="w-30 h-30 rounded-full overflow-hidden shadow-md" >
                <Image src={image} alt={label} width={190} height={190} className="object-cover w-full h-full" />
            </div>
            <p>{label}</p>
        </div>
    )
}