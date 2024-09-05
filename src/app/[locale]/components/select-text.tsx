"use client";

import { FileContentArray } from "@/app/libs/types";
import SelectComponent from "./ui/select";

interface SelectTextProps {
  text: FileContentArray;
}

const SelectText = ({ text }: SelectTextProps) => {
  return (
    <div className="flex w-[400px] h-[50px]">
      <SelectComponent text={text} />
    </div>
  )
}

export default SelectText