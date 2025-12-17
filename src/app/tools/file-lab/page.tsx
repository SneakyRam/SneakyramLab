import FileLab from "@/components/tools/FileLab";

export default function FileLabPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          File Conversion Lab
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Understand formats. Convert safely. Download instantly.
          <br />
          <span className="font-semibold text-primary">All conversions happen in your browser. Your files are never uploaded.</span>
        </p>
      </div>
      <FileLab />
    </div>
  );
}
