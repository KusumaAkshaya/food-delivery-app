'use client'
import Image from 'next/image'
import Link from 'next/link'
import {restaurentList} from '../data/restaurentData'

export default function Restaurents()
{
     return(
        <div className="pt-10" >
            <div>
               <h2 className="pl-10 text-2xl font-bold " >Restaurents</h2>
            </div>
            <div>
                <div className="flex flex-row p-10 overflow-x-scroll gap-10" >
                    {restaurentList.map((item, index) => (
                        <Link href={`/restaurant/${item.rname}`} key={index}>
                        
                        <div  className="flex flex-col shadow-lg rounded-sm h-90" >
                            <div className="w-75 h-3/5" >
                                <Image src={item.image} alt={item.name} width={200} height={200} className="object-cover w-full h-full rounded-sm" />
                            </div>
                            <div className="h-2/5 bg-gray-100 content-between p-2" >
                                <h2 className="text-2xl" >{item.name}</h2>
                                <p> {item.type}</p>
                                <p>📍{item.location}</p>
                                <p>⭐{item.rating}</p>
                            </div>
                        </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
     )
}