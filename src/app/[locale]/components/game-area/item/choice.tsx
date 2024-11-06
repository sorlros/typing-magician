"use client";

import React from 'react'
import Image from 'next/image';

const Choice = () => {

  return (
    <div className="w-28 h-28 outer-hexagon flex items-center justify-center bg-white">
      <div className="inner-hexagon w-24 h-24 bg-neutral-700">
        <Image 
          src=""
          alt="Item"
        />
        <span></span>
      </div>
    </div>
  )
}

export default Choice