const IdentifyTitle = ({ color, title }) => {
  return (
    <div>
      <span className={`${color} px-3`}>
        <span className="invisible"></span>
      </span>
      <span className="pl-2 text-gray-600">{title}</span>
    </div>
  );
};

export default IdentifyTitle;
