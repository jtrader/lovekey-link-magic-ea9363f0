export class jsPDF {
  internal = { pageSize: { getWidth: () => 595, getHeight: () => 842 } };
  constructor(_opts?: any) {}
  setFont(_font?: string, _style?: string) {}
  setFontSize(_size?: number) {}
  text(_text: string | string[], _x?: number, _y?: number, _opts?: any) {}
  setTextColor(_r?: number, _g?: number, _b?: number) {}
  setDrawColor(_color?: number) {}
  line(_x1?: number, _y1?: number, _x2?: number, _y2?: number) {}
  splitTextToSize(text: string, _maxW?: number): string[] {
    return [text];
  }
  addImage(_data?: string, _format?: string, _x?: number, _y?: number, _w?: number, _h?: number) {}
  addPage() {}
  save(_filename?: string) {}
}

export default jsPDF;
