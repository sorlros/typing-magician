import { TextItem } from "@/app/libs/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTextStore } from "@/store/use-text-store";
import { useTypingStore } from "@/store/use-typing-store";
import { useEffect, useId } from "react";

interface SelectProps {
  text: TextItem[];
}

const SelectComponent = ({ text }: SelectProps) => {
  const id = useId();
  const { setText } = useTextStore();
  const { resetTyping } = useTypingStore();

  const handleChangeText = (selectedTitle: string) => {
    const selectedText = text.find((content) => content.title === selectedTitle);
    if (selectedText) {
      setText({
        title: selectedText.title,
        content: selectedText.content,
      });
    }
  }

  // useEffect(() => {
  //   resetTyping();
  // }, [setText])

  return (
    <Select onValueChange={handleChangeText}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="문서를 선택하세요." />
      </SelectTrigger>
      <SelectContent>
        {
          text.map((content) => (
            <SelectItem value={content.title} key={`${id}-${content.title}`}>
              {content.title}
            </SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}

export default SelectComponent;