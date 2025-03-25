export const Card = ({ children, ...props }) => (
    <div className="bg-white shadow rounded-lg p-4" {...props}>
      {children}
    </div>
  );
  
  export const CardContent = ({ children }) => (
    <div className="text-gray-700">{children}</div>
  );
  
  export const CardHeader = ({ title }) => (
    <h2 className="text-lg font-semibold">{title}</h2>
  );
  