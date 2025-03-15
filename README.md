# Drawstring UI

A web-based interface for creating and visualizing drawstring commands across multiple circular displays. This project provides an interactive way to draw shapes, text, and patterns using a simple command syntax.

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Setup

1. Clone the repository:
```bash
git clone https://gitlab.com/warmfusion/drawstring-ui.git
cd drawstring-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Drawstring Command Reference

Each orb accepts a series of commands, one per line. Here's the complete command reference:

### Basic Shapes

```
fill,color                    # Fill entire orb
f,color                      # Short for fill

line,x1,y1,x2,y2,color      # Draw a line
l,x1,y1,x2,y2,color         # Short for line

circle,x,y,radius,color      # Draw circle outline
c,x,y,radius,color          # Short for circle

fcircle,x,y,radius,color    # Draw filled circle
fc,x,y,radius,color         # Short for fcircle

rectangle,x,y,w,h,color     # Draw rectangle outline
r,x,y,w,h,color            # Short for rectangle

frectangle,x,y,w,h,color   # Draw filled rectangle
fr,x,y,w,h,color           # Short for frectangle

triangle,x1,y1,x2,y2,x3,y3,color    # Draw triangle outline
tri,x1,y1,x2,y2,x3,y3,color         # Short for triangle

ftriangle,x1,y1,x2,y2,x3,y3,color   # Draw filled triangle
ftri,x1,y1,x2,y2,x3,y3,color        # Short for ftriangle
```

### Arcs

```
arc,x,y,radius,startAngle,endAngle,thickness,color[,fillColor]
sarc,x,y,radius,startAngle,endAngle,thickness,color,fillColor,segments
```

### Text and Font Commands

```
text,text,x,y               # Draw text
t,text,x,y                 # Short for text

textc,text,x,y             # Draw centered text
tc,text,x,y               # Short for textc

textf,text,x,y,w,h        # Draw fitted text
tf,text,x,y,w,h          # Short for textf

font,name                 # Set font (r=Roboto, f=monospace, dseg7, dseg14)
fsize,size               # Set font size
fs,size                 # Short for fsize

falign,align            # Set text alignment (l=left, c=center, r=right)
fa,align               # Short for falign

fcolor,color           # Set font color
fcol,color            # Short for fcolor

fbcolor,color         # Set font background color
fbcol,color          # Short for fbcolor
```

### Colors

Colors can be specified in several formats:
- Hex format: `#RRGGBB` or `0xRRGGBB`
- Named colors: `red`, `green`, `blue`, `yellow`, `cyan`, `magenta`, `black`, `white`, `gray`
- Special: `transparent` (for background colors)

### Coordinate System

- The orb display is 240x240 pixels
- (0,0) is at the top-left corner
- (240,240) is at the bottom-right corner
- The center point is at (120,120)

## Example Commands

Here are some example commands to get you started:

1. Simple Clock Face:
```
fill,white
circle,120,120,110,#333
fcircle,120,120,105,white
line,120,120,120,60,red
line,120,120,160,120,blue
```

2. Colorful Target:
```
fill,white
fcircle,120,120,100,#FFE0E0
fcircle,120,120,80,#FFE0FF
fcircle,120,120,60,#E0E0FF
circle,120,120,100,red
circle,120,120,80,blue
```

3. Text Example:
```
fill,white
font,r
fsize,24
fcolor,blue
textc,Hello!,120,120
```

## Development

- The project is built with React, TypeScript, and Vite
- Canvas rendering is handled by the `DrawstringRenderer` class
- Each orb is independent and can be controlled separately

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 