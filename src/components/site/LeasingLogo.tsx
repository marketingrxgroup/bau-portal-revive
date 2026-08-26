type Props = { provider: "tbi bank" | "UniCredit Consumer Financing" | "OTP Leasing" };

export function LeasingLogo({ provider }: Props) {
  if (provider === "tbi bank") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="rounded-md bg-white px-1.5 py-0.5 text-[13px] font-extrabold lowercase leading-none tracking-tight text-[#f07c1b]">
          tbi
        </span>
        <span className="text-[15px] font-semibold lowercase tracking-tight text-white">bank</span>
      </span>
    );
  }

  if (provider === "UniCredit Consumer Financing") {
    return (
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-white">UniCredit</span>
        <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-white/85">
          Consumer Financing
        </span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <span className="grid size-4 place-items-center rounded-full bg-white text-[10px] font-black leading-none text-[#0b7a5a]">
        C
      </span>
      <span className="text-[15px] font-extrabold lowercase leading-none tracking-tight text-white">
        otp
      </span>
      <span className="text-[14px] font-medium italic leading-none text-white">Leasing</span>
    </span>
  );
}
