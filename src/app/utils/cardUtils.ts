type Item = {
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
  image?: string;
};

export function getCartItems()
{
    if(typeof window === 'undefined') return[]; // if this runs at server, there is no window, no cart access on server
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : []
}

export function addCartItem(item: any)
{
    let cart = getCartItems();
    
    if(cart.length > 0 && cart[0].restaurant !== item.restaurant)
    {
        const cartReset = window.confirm("You are ordering froom another restaurant. Clear cart?")
        if(!cartReset) return;
        cart = [];
    }

    const alreadyExist = cart.findIndex( (i: Item )=> i.name === item.name && i.restaurant === item.restaurant) ;
    
    if(alreadyExist !== -1)
    {
        cart[alreadyExist].quantity += 1;
    }
    else
    {
        cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart)) //local storage only stores string
}

export function removeFromCart(index : number)
{
    const cart = getCartItems();
    cart.splice(index, 1);  //splice(a, b) removes b items from index a
    localStorage.setItem('cart', JSON.stringify(cart));
    
}

export function clearCart()
{
    localStorage.removeItem('cart');
}
