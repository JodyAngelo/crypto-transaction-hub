import { FaTwitter, FaDiscord, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4">
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-[#1F2A36] font-semibold text-lg tracking-wide">
            Send<span className="text-blue-400">It</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1 text-center sm:text-left">
            Simplifying blockchain transactions for everyone.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <div className="flex gap-5 mt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <FaDiscord size={18} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              <FaGithub size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl flex justify-between items-center text-gray-500 text-xs">
        <p>© 2025 SendIt. All rights reserved.</p>
        <p>
          Built with <span className="text-blue-400">Ethereum</span>
        </p>
      </div>
    </div>
  );
}
