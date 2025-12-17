
import TextEncoderDecoder from "@/components/tools/TextEncoderDecoder";
import AnimatedGradientText from "@/components/effects/animated-gradient-text";

export default function EncoderDecoderPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <AnimatedGradientText as="h1" className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Text Encoder / Decoder
        </AnimatedGradientText>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          A handy tool for encoding and decoding text in various formats like Base64, URL, Hex, and more.
          <br />
          <span className="font-semibold">All operations are done in your browser. Your data is never sent to our servers.</span>
        </p>
      </div>
      <TextEncoderDecoder />
    </div>
  );
}
