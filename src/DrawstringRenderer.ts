export class DrawstringRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private commands: Map<string, (params: string[]) => void> = new Map();
  private currentFont: string = 'Arial';
  private currentFontSize: number = 16;
  private currentFontColor: string = '#000000';
  private currentBackColor: string = 'transparent';
  private currentAlign: CanvasTextAlign = 'left';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    this.setupCommands();
  }

  private setupCommands() {
    this.commands = new Map([
      ['fill', this.fill.bind(this)],
      ['f', this.fill.bind(this)],
      ['line', this.line.bind(this)],
      ['l', this.line.bind(this)],
      ['circle', this.circle.bind(this)],
      ['c', this.circle.bind(this)],
      ['fcircle', this.fillCircle.bind(this)],
      ['fc', this.fillCircle.bind(this)],
      ['rectangle', this.rectangle.bind(this)],
      ['rect', this.rectangle.bind(this)],
      ['r', this.rectangle.bind(this)],
      ['frectangle', this.fillRectangle.bind(this)],
      ['frect', this.fillRectangle.bind(this)],
      ['fr', this.fillRectangle.bind(this)],
      ['triangle', this.triangle.bind(this)],
      ['tri', this.triangle.bind(this)],
      ['ftriangle', this.fillTriangle.bind(this)],
      ['ftri', this.fillTriangle.bind(this)],
      ['arc', this.arc.bind(this)],
      ['sarc', this.smoothArc.bind(this)],
      ['text', this.text.bind(this)],
      ['t', this.text.bind(this)],
      ['textc', this.textCentered.bind(this)],
      ['tc', this.textCentered.bind(this)],
      ['textf', this.textFitted.bind(this)],
      ['tf', this.textFitted.bind(this)],
      ['font', this.setFont.bind(this)],
      ['fsize', this.setFontSize.bind(this)],
      ['fs', this.setFontSize.bind(this)],
      ['falign', this.setFontAlign.bind(this)],
      ['fa', this.setFontAlign.bind(this)],
      ['fcolor', this.setFontColor.bind(this)],
      ['fcol', this.setFontColor.bind(this)],
      ['fbcolor', this.setFontBackColor.bind(this)],
      ['fbcol', this.setFontBackColor.bind(this)],
    ]);
  }

  private parseColor(color: string): string {
    if (color.startsWith('#')) return color;
    if (color.startsWith('0x')) {
      return '#' + color.substring(2);
    }
    // Handle basic color names
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'green': '#00FF00',
      'blue': '#0000FF',
      'yellow': '#FFFF00',
      'cyan': '#00FFFF',
      'magenta': '#FF00FF',
      'gray': '#808080',
      'transparent': 'transparent'
    };
    return colorMap[color.toLowerCase()] || color;
  }

  private fill(params: string[]) {
    const color = this.parseColor(params[0]);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private line(params: string[]) {
    const [x1, y1, x2, y2, color] = params;
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.parseColor(color);
    this.ctx.moveTo(Number(x1), Number(y1));
    this.ctx.lineTo(Number(x2), Number(y2));
    this.ctx.stroke();
  }

  private circle(params: string[]) {
    const [x, y, radius, color] = params;
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.parseColor(color);
    this.ctx.arc(Number(x), Number(y), Number(radius), 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private fillCircle(params: string[]) {
    const [x, y, radius, color] = params;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.parseColor(color);
    this.ctx.arc(Number(x), Number(y), Number(radius), 0, Math.PI * 2);
    this.ctx.fill();
  }

  private rectangle(params: string[]) {
    const [x, y, width, height, color] = params;
    this.ctx.strokeStyle = this.parseColor(color);
    this.ctx.strokeRect(Number(x), Number(y), Number(width), Number(height));
  }

  private fillRectangle(params: string[]) {
    const [x, y, width, height, color] = params;
    this.ctx.fillStyle = this.parseColor(color);
    this.ctx.fillRect(Number(x), Number(y), Number(width), Number(height));
  }

  private triangle(params: string[]) {
    const [x1, y1, x2, y2, x3, y3, color] = params;
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.parseColor(color);
    this.ctx.moveTo(Number(x1), Number(y1));
    this.ctx.lineTo(Number(x2), Number(y2));
    this.ctx.lineTo(Number(x3), Number(y3));
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private fillTriangle(params: string[]) {
    const [x1, y1, x2, y2, x3, y3, color] = params;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.parseColor(color);
    this.ctx.moveTo(Number(x1), Number(y1));
    this.ctx.lineTo(Number(x2), Number(y2));
    this.ctx.lineTo(Number(x3), Number(y3));
    this.ctx.closePath();
    this.ctx.fill();
  }

  private arc(params: string[]) {
    const [x, y, radius, startAngle, endAngle, thickness, color, fillColor] = params;
    this.ctx.beginPath();
    if (fillColor) {
      this.ctx.fillStyle = this.parseColor(fillColor);
      this.ctx.arc(Number(x), Number(y), Number(radius), Number(startAngle) * Math.PI / 180, Number(endAngle) * Math.PI / 180);
      this.ctx.fill();
    }
    this.ctx.strokeStyle = this.parseColor(color);
    this.ctx.lineWidth = Number(thickness) || 1;
    this.ctx.arc(Number(x), Number(y), Number(radius), Number(startAngle) * Math.PI / 180, Number(endAngle) * Math.PI / 180);
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
  }

  private smoothArc(params: string[]) {
    const [x, y, radius, startAngle, endAngle, thickness, color, fillColor, segments] = params;
    const segCount = Number(segments) || 60;
    const angleStart = Number(startAngle) * Math.PI / 180;
    const angleEnd = Number(endAngle) * Math.PI / 180;
    const angleStep = (angleEnd - angleStart) / segCount;

    this.ctx.beginPath();
    if (fillColor) {
      this.ctx.fillStyle = this.parseColor(fillColor);
      for (let i = 0; i <= segCount; i++) {
        const angle = angleStart + (angleStep * i);
        const px = Number(x) + Math.cos(angle) * Number(radius);
        const py = Number(y) + Math.sin(angle) * Number(radius);
        if (i === 0) this.ctx.moveTo(px, py);
        else this.ctx.lineTo(px, py);
      }
      this.ctx.fill();
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.parseColor(color);
    this.ctx.lineWidth = Number(thickness) || 1;
    for (let i = 0; i <= segCount; i++) {
      const angle = angleStart + (angleStep * i);
      const px = Number(x) + Math.cos(angle) * Number(radius);
      const py = Number(y) + Math.sin(angle) * Number(radius);
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
  }

  private setFont(params: string[]) {
    const [font] = params;
    const fontMap: { [key: string]: string } = {
      'r': 'Roboto',
      'f': 'monospace',
      'dseg7': 'DSEG7',
      'dseg14': 'DSEG14',
      'default': 'Arial'
    };
    this.currentFont = fontMap[font.toLowerCase()] || fontMap['default'];
    this.updateFont();
  }

  private setFontSize(params: string[]) {
    const [size] = params;
    this.currentFontSize = Number(size);
    this.updateFont();
  }

  private setFontAlign(params: string[]) {
    const [align] = params;
    const alignMap: { [key: string]: CanvasTextAlign } = {
      'l': 'left',
      'c': 'center',
      'r': 'right',
    };
    this.currentAlign = alignMap[align.toLowerCase()] || 'left';
    this.ctx.textAlign = this.currentAlign;
  }

  private setFontColor(params: string[]) {
    const [color] = params;
    this.currentFontColor = this.parseColor(color);
  }

  private setFontBackColor(params: string[]) {
    const [color] = params;
    this.currentBackColor = this.parseColor(color);
  }

  private updateFont() {
    this.ctx.font = `${this.currentFontSize}px ${this.currentFont}`;
  }

  private text(params: string[]) {
    const [text, x, y, ...rest] = params;
    this.ctx.fillStyle = this.currentFontColor;
    if (this.currentBackColor !== 'transparent') {
      const metrics = this.ctx.measureText(text);
      const height = this.currentFontSize;
      this.ctx.fillStyle = this.currentBackColor;
      this.ctx.fillRect(Number(x), Number(y) - height + 4, metrics.width, height);
      this.ctx.fillStyle = this.currentFontColor;
    }
    this.ctx.fillText(text, Number(x), Number(y));
  }

  private textCentered(params: string[]) {
    const [text, x, y] = params;
    this.ctx.textAlign = 'center';
    this.text([text, x, y]);
    this.ctx.textAlign = this.currentAlign;
  }

  private textFitted(params: string[]) {
    const [text, x, y, width, height] = params;
    let fontSize = Number(height);
    this.ctx.font = `${fontSize}px ${this.currentFont}`;
    let metrics = this.ctx.measureText(text);
    
    while (metrics.width > Number(width) && fontSize > 1) {
      fontSize--;
      this.ctx.font = `${fontSize}px ${this.currentFont}`;
      metrics = this.ctx.measureText(text);
    }
    
    const xPos = Number(x) + (Number(width) - metrics.width) / 2;
    const yPos = Number(y) + Number(height) / 2;
    this.text([text, xPos.toString(), yPos.toString()]);
    this.updateFont(); // Restore original font size
  }

  public render(script: string) {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Reset text properties
    this.currentFont = 'Arial';
    this.currentFontSize = 16;
    this.currentFontColor = '#000000';
    this.currentBackColor = 'transparent';
    this.currentAlign = 'left';
    this.updateFont();

    // Process each line
    const lines = script.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('//')) continue;

      const params = trimmedLine.split(',').map(p => p.trim());
      const command = params.shift()?.toLowerCase();
      
      if (command && this.commands.has(command)) {
        try {
          this.commands.get(command)!(params);
        } catch (error) {
          console.error(`Error executing command: ${command}`, error);
        }
      }
    }
  }
} 