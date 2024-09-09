"use client";

import { TextItem } from "@/app/libs/types";
import SelectComponent from "./ui/select";

interface SelectTextProps {
  text: TextItem[];
}

const SelectText = ({ text }: SelectTextProps) => {
  return (
    <div className="flex w-[400px] h-[50px]">
      <SelectComponent text={text} />
    </div>
  )
}

export default SelectText