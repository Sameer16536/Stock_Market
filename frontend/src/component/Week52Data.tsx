interface WeekData {
  label: string;
  count: number;
}

interface WeekDataProps {
  weekData: WeekData[];
}
const Week52Data: React.FC<WeekDataProps> = ({ weekData }) => {
  const currentTime = Date.now(); // Get the current timestamp in milliseconds
  const dateObject = new Date(currentTime);
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");
  console.log("Data received in Week at:", `${hours}:${minutes}:${seconds}`);
  console.log("Data receiveed in Week COmp", weekData);
  return (
    <div className="w-full max-w-md mx-auto mt-6 p-4 bg-white shadow-md rounded-lg">
      {/* <h3 className="text-lg font-bold text-gray-700 mb-4">{weekData.key}</h3> */}
      <div className="flex flex-col gap-4">
        {weekData.map((item) => (
          <div
            key={item.label}
            className={`flex justify-between items-center px-4 py-3 rounded-md ${
              item.count >= 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span className="text-base font-semibold">{item.label}</span>
            <span className="text-lg font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Week52Data;
