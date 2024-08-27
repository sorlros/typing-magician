import { ClipLoader } from "react-spinners";

interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <ClipLoader className={className} />
    </div>
  );
};
