import { FileContentArray } from "@/app/libs/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectProps {
  text: FileContentArray;
}

const SelectComponent = ({ text }: SelectProps) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="문서를 선택하세요." />
      </SelectTrigger>
      <SelectContent>
        {
          text.map((content) => (
            <SelectItem value={content.file} key={content.file}>
              {content.file}
            </SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}

export default SelectComponent;