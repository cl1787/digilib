/* DocuImage -- General image interface class implementation

  Digital Image Library servlet components

  Copyright (C) 2001, 2002, 2003 Robert Casties (robcast@mail.berlios.de)

  This program is free software; you can redistribute  it and/or modify it
  under  the terms of  the GNU General  Public License as published by the
  Free Software Foundation;  either version 2 of the  License, or (at your
  option) any later version.
   
  Please read license.txt for the full details. A copy of the GPL
  may be found at http://www.gnu.org/copyleft/lgpl.html

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

*/

package digilib.image;

import java.awt.Image;
import java.awt.Rectangle;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.ServletException;

import org.apache.log4j.Logger;

import digilib.io.FileOpException;
import digilib.io.ImageInput;
import digilib.util.ImageSize;

/** Simple abstract implementation of the <code>DocuImage</code> interface.
 *
 * This implementation provides basic functionality for the utility methods like
 * <code>getKnownFileTypes</code>. Image methods like
 * <code>loadImage</code>, <code>writeImage</code>, <code>getWidth</code>,
 * <code>getHeight</code>, <code>crop</code> and <code>scale</code> must be
 * implemented by derived classes.
 */
public abstract class DocuImageImpl implements DocuImage {

	/** logger */
	protected static final Logger logger = Logger.getLogger(DocuImage.class);
	
	/** Interpolation quality. */
	protected int quality = 0;
	
	/** epsilon for float comparisons. */
	public final double epsilon = 1e-5;

	/** image size */
    protected ImageSize imgSize = null;

    /** ImageInput that was read */
    protected ImageInput input;

	/**
	 * Returns the quality.
	 * @return int
	 */
	public int getQuality() {
		return quality;
	}

	/**
	 * Sets the quality.
	 * @param quality The quality to set
	 */
	public void setQuality(int quality) {
		this.quality = quality;
	}

	/** Crop and scale the current image.
	 *
	 * The current image is cropped to a rectangle of width, height at position
	 * x_off, y_off. The resulting image is scaled by the factor scale using the
	 * interpolation quality qual (0=worst).
	 * 
	 * @param x_off X offset of the crop rectangle in pixel.
	 * @param y_off Y offset of the crop rectangle in pixel.
	 * @param width Width of the crop rectangle in pixel.
	 * @param height Height of the crop rectangle in pixel.
	 * @param scale Scaling factor.
	 * @param qual Interpolation quality (0=worst).
	 * @throws ImageOpException Exception thrown on any error.
	 */
	public void cropAndScale(
		int x_off, int y_off, int width, int height, double scale, int qual) 
		throws ImageOpException {
		// default implementation: first crop, then scale
		setQuality(qual);
		crop(x_off, y_off, width, height);
		scale(scale, scale);
	}
	
	/* (non-Javadoc)
	 * @see digilib.image.DocuImage#getMimetype()
	 */
	public String getMimetype() {
	    if (input != null) {
	        return input.getMimetype();
	    }
	    return null;
	}

    /* (non-Javadoc)
     * @see digilib.image.DocuImage#identify(digilib.io.ImageFile)
     */
    public ImageInput identify(ImageInput ii) throws IOException {
        // just a do-nothing implementation
        return null;
    }

	public void rotate(double angle) throws ImageOpException {
		// just a do-nothing implementation
	}

	public void mirror(double angle) throws ImageOpException {
		// just a do-nothing implementation
	}

	public void enhance(float mult, float add) throws ImageOpException {
		// just a do-nothing implementation
	}

	public boolean isSubimageSupported() {
		// partial loading not supported per default
		return false;
	}

	public void loadSubimage(ImageInput ii, Rectangle region, int subsample)
		throws FileOpException {
		// empty implementation
	}

	public void enhanceRGB(float[] rgbm, float[] rgba)
		throws ImageOpException {
		// emtpy implementation
	}

	public void colorOp(ColorOp op) throws ImageOpException {
		// emtpy implementation
	}

	public void dispose() {
		// emtpy implementation
	}

	public Iterator<String> getSupportedFormats() {
		List<String> empty = new LinkedList<String>();
		return empty.iterator();
	}

    public void crop(int xoff, int yoff, int width, int height)
            throws ImageOpException {
        // emtpy implementation
    }

    public Image getAwtImage() {
        // emtpy implementation
        return null;
    }

    public int getHeight() {
        ImageSize is = getSize();
        if (is != null) {
            return is.getHeight();
        }
        return 0;
    }

    public int getWidth() {
        ImageSize is = getSize();
        if (is != null) {
            return is.getWidth();
        }
        return 0;
    }

    public ImageSize getSize() {
        return imgSize;
    }

    public abstract void loadImage(ImageInput ii) throws FileOpException;

    public abstract void scale(double scaleX, double scaleY) throws ImageOpException;

    public abstract void writeImage(String mt, OutputStream ostream)
            throws ServletException, ImageOpException;

	
}
