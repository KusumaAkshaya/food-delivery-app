'use client'
import DishList from "./DishList"

export default function WhatsOnYourMind()
{
    return(
        <div className="container">
            <div className="dishes-carousel">
              <h2>Categorie</h2>
              <DishList />
            </div>
        </div>
    )
}