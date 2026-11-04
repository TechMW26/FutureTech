const assetPathPrefix = "/assets";
const imgArrow1 = `${assetPathPrefix}/a2d31.svg`;
const imgImage4 = `${assetPathPrefix}/55399.png`;
const imgPolygon9 = `${assetPathPrefix}/4f207.svg`;
const imgPolygon10 = `${assetPathPrefix}/2c52f.svg`;
const imgPolygon12 = `${assetPathPrefix}/224ee.svg`;
const imgPolygon13 = `${assetPathPrefix}/2702e.svg`;
const imgPolygon17 = `${assetPathPrefix}/5586e.svg`;
const imgPolygon16 = `${assetPathPrefix}/db866.svg`;

function Hexagon({
  src,
  className,
  innerInset,
}: {
  src: string;
  className: string;
  innerInset: string;
}) {
  return (
    <div
      className={`group absolute cursor-pointer transition-transform duration-300 ease-out hover:z-10 hover:scale-110 ${className}`}
    >
      <div className={`absolute ${innerInset}`}>
        <img
          alt=""
          className="block max-w-none size-full transition-[filter,opacity] duration-300 group-hover:drop-shadow-[0_0_20px_rgba(91,169,233,0.6)]"
          src={src}
        />
      </div>
    </div>
  );
}

function Component1({ className }: { className?: string }) {
  return (
    <div className={className || "h-[20px] relative w-[88px]"} data-name="Component 1">
      <div className="absolute bg-black inset-0 rounded-[13px]" />
      <p className="[word-break:break-word] absolute font-['Inter:Regular'] font-normal inset-[35%_18.18%_0_10.23%] leading-[0.865] not-italic text-[8px] text-white tracking-[-0.48px]">
        Explore our work
      </p>
      <div className="absolute inset-[55%_13.64%_45%_77.27%]">
        <div className="absolute inset-[-3.68px_-6.25%_-3.68px_0]">
          <img alt="" className="block max-w-none size-full" src={imgArrow1} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfbf5]">
      <div className="relative h-[319px] w-[527px] shrink-0 bg-[#fcfbf5]">
        <Hexagon src={imgPolygon9} className="h-[72px] left-[344px] top-[71px] w-[78px]" innerInset="inset-[-11.25%_-7.79%_-19.59%_-7.79%]" />
        <Hexagon src={imgPolygon10} className="h-[72px] left-[305px] top-[129px] w-[78px]" innerInset="inset-[-8.47%_-7.79%_-19.59%_-7.79%]" />
        <Hexagon src={imgPolygon10} className="h-[72px] left-[383px] top-[129px] w-[78px]" innerInset="inset-[-8.47%_-7.79%_-19.59%_-7.79%]" />
        <Hexagon src={imgPolygon12} className="h-[58px] left-[422px] top-[78px] w-[63px]" innerInset="inset-[-10.53%_-11.24%_-24.32%_-11.24%]" />
        <Hexagon src={imgPolygon13} className="h-[57px] left-[422px] top-[202px] w-[63px]" innerInset="inset-[-10.78%_-11.24%_-24.82%_-11.24%]" />
        <Hexagon src={imgPolygon13} className="h-[57px] left-[281px] top-[202px] w-[63px]" innerInset="inset-[-10.78%_-11.24%_-24.82%_-11.24%]" />
        <Hexagon src={imgPolygon12} className="h-[58px] left-[281px] top-[78px] w-[63px]" innerInset="inset-[-10.53%_-11.24%_-24.32%_-11.24%]" />
        <Hexagon src={imgPolygon17} className="h-[47px] left-[396px] top-[31px] w-[51px]" innerInset="inset-[-12.99%_-15.46%_-30.01%_-15.46%]" />
        <Hexagon src={imgPolygon17} className="h-[47px] left-[461px] top-[142px] w-[51px]" innerInset="inset-[-12.99%_-15.46%_-30.01%_-15.46%]" />
        <Hexagon src={imgPolygon17} className="h-[47px] left-[318px] top-[253px] w-[51px]" innerInset="inset-[-12.99%_-15.46%_-30.01%_-15.46%]" />
        <Hexagon src={imgPolygon17} className="h-[47px] left-[254px] top-[145px] w-[51px]" innerInset="inset-[-12.99%_-15.46%_-30.01%_-15.46%]" />
        <Hexagon src={imgPolygon16} className="h-[71px] left-[344px] top-[188px] w-[78px]" innerInset="inset-[-8.64%_-7.79%_-19.91%_-7.79%]" />

        <div className="[word-break:break-word] absolute font-['Inter:Black'] font-black h-[175px] leading-[0] left-[27px] not-italic text-[64px] text-black top-[78px] tracking-[-3.84px] w-[231px]">
          <p className="leading-[71.50997924804688%] mb-0">Our</p>
          <p className="leading-[71.50997924804688%]">Works</p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter:Light'] font-light h-[67px] leading-[0.865] left-[34px] not-italic text-[8px] text-black top-[202px] tracking-[-0.48px] w-[205px]">
          A growing ecosystem of companies , products and initiatives focused on healthier people , cleaner environments and a better tommorow.
        </p>
        <Component1 className="absolute h-[20px] left-[34px] top-[233px] w-[88px]" />

        <div className="absolute left-[361px] shadow-[0px_1px_8.6px_0px_#5ba9e9] size-[43px] top-[86px]" data-name="image 4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[192.94%] left-[-98.72%] max-w-none top-[-0.32%] w-[198.72%]" src={imgImage4} />
          </div>
        </div>
        <div className="absolute h-[43px] left-[401px] opacity-74 top-[143px] w-[42px]" data-name="image 5">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[195.45%] left-[-103.95%] max-w-none top-[-95.13%] w-[203.95%]" src={imgImage4} />
          </div>
        </div>
        <div className="absolute h-[43px] left-[324px] opacity-74 top-[143px] w-[40px]" data-name="image 7">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[192.94%] left-[-8.45%] max-w-none top-[-0.32%] w-[218.31%]" src={imgImage4} />
          </div>
        </div>
        <div className="absolute left-[361px] opacity-74 size-[42px] top-[202px]" data-name="image 6">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[197.08%] left-0 max-w-none top-[-96.75%] w-[201.3%]" src={imgImage4} />
          </div>
        </div>
      </div>
    </div>
  );
}
