const StateFlagImage = ({
  flagFile,
  name,
}: {
  flagFile: string;
  name: string;
}) => {
  // If the state name contains "wilayah" (case-insensitive), use the Wilayah flag file
  const isWilayah = name.includes("Wilayah");
  const fileToUse = isWilayah ? "Flag_of_the_Wilayah.svg" : flagFile;

  return (
    <div className="rounded-sm overflow-hidden w-7 h-7">
      <img
        src={`/images/negeri/${fileToUse}`}
        alt={`Flag of ${name}`}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default StateFlagImage;
