export const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium text-red-500">{errorMessage}</p>
    </div>
  );
};

export default ErrorMessage;
