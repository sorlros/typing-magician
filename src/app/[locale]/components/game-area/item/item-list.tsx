import React from 'react'
import Image from 'next/image';

const ItemList = () => {
  return (
    <div>
      <Image 
        src="/game_images/Item/items.png"
        alt="ItemList"
        width={100}
        height={100}
      />
    </div>
  )
}

export default ItemList