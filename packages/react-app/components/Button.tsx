type Props = {
  text: string;
  onClick: () => void;
  loading: boolean;
};

function Button({ text, onClick, loading }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-black rounded-full text-white font-semibold px-9 py-3 hover:bg-black/80"
    >
      {loading && (
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 mr-3 text-gray-200 animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 58.5988C180 78.2051 77.6142 100.591 50 108.591C22.3858 180.591 8 78.2051 8 50.5988C8 22"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.8489C96.393 38.4838 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.369"
            fill="#1C64F2"
          />
        </svg>
      )}
      {loading ? "Sending..." : text}
    </button>
  );
}
export default Button;
