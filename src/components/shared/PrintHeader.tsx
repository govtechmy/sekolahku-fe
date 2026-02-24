export default function PrintHeader() {
  const today = new Date().toLocaleDateString("ms-MY");

  return (
    <div className="hidden print:block w-full text-right text-xs text-gray-500 mb-4">
      Dicetak pada: {today}
    </div>
  );
}
