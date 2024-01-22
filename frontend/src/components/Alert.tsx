import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertUI({
  title,
  errors,
}: {
  title: string;
  errors: string[] | null;
}) {
  if (errors === null) {
    return <></>;
  }
  return (
    <div className="w-full flex flex-col items-center">
      <Alert className="border-2 rounded-xl border-red-500 w-[90%]">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <ol>
            {errors.map((err, i) => (
              <li key={i} className="list-disc ml-3">
                {err}
              </li>
            ))}
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}
