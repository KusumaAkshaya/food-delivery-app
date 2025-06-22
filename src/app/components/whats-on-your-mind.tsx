'use client'
import DishList from "./DishList"

export default function WhatsOnYourMind()
{
    return(
        <div className="container">
            <div className="pt-10">
              <h1 className="text-2xl font-bold pl-5" >Pick a Bite, Set the Vibe!</h1>
              <div className="flex justify-center" > <DishList /> </div>
            </div>
        </div>
    )
}