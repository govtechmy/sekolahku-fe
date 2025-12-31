const StateFlagImage = ({
  flagFile,
  name,
}: {
  flagFile: string;
  name: string;
}) => (
  <div className="rounded-sm overflow-hidden w-6 h-6 border-[1.5px] border-outline-200">
    <img
      src={`/images/negeri/${flagFile}`}
      alt={`Flag of ${name}`}
      className="h-full w-full object-cover"
    />
  </div>
);

export default StateFlagImage;
