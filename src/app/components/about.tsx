'use client'
import {about} from '../data/about'
import Image from 'next/image'

export default function About()
{
    return(<div className="mt-10 bg-black flex flex-row" >
        <div className=" w-full lg:w-3/5 flex flex-col items-center " >
            <div className="p-5 m-5 border-1 w-50 text-4xl text-white" ><p className="text-center" >AboutUs</p></div>
            <div><p className="text-3xl" >🍴</p></div>
            <div className="p-10 text-white" ><p> We started FoodieExpress with a simple dream — to connect people with flavors they love! From local favorites to global treats, we're here to make every meal memorable. Powered by passion, delivered with love.</p></div>
        </div>
        <div className="lg:block lg:w-2/5 md: hidden h-full " >
           <Image src='/images/about/fig1.jpg' alt="" className="object-cover w-full h-full" width={100} height={100}  />
        </div>
    </div>)
}