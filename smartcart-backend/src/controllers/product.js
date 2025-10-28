import Product from "../models/Product.js";

// Obtener todos los productos del usuario autenticado
export const getProducts = async (req, res) => {
    try{
          // Solo mostrar los productos creados por el usuario autenticado
        const products = await Product.find({ user: req.user._id })
        res.status(200).json(products);
    } catch (error){
    res.status(500).json({message: error.message});
}
    };

// Crear un nuevo producto
export const createProduct = async (req, res) => {
try {
    const { name, description, price, category, quantity } = req.body;

    //validar los datos minimos
    if (!name || !price || !category) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    //crear el producto y asignarlo al usuario autenticado
    const newProduct = await Product.create({
        name,
        description,
        price,
        category,
        quantity,
        user: req.user._id, //viene del middleware auth
    });
      res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

    //Obtener el producto por id
    export const getProductById = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);

            //verificar existencia
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            //Asegurar que el producto pertenece al usuario autenticado
            if (product.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    //Actualizar un producto
    export const updateProduct = async (req, res) => {
        try { 
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (product.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to edit this product" });
            }

            const updated = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        };

        //Eliminar un producto
        export const deleteProduct = async (req, res) => {
            try {
                const product = await Product.findById(req.params.id);

                if(!product) {
                   
                    return res.status(404).json({ message: "Product not found" });
                }

                if(product.user.toString() !== req.user._id.toString()) {
                    return res.status(403).json({ message: "Not authorized to delete this product" });
                }
                await product.deleteOne();
                res.status(200).json({ message: "Product deleted successfully" });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            };
          
            //Marcar un producto como completado o pendiente
            export const toggleCompleted = async (req, res) => {
                try {
                    const product = await Product.findById(req.params.id);

                    if(!product){
                        return res.status(404).json({ message: "Product not found" });
                    }

                    if(product.user.toString() !== req.user._id.toString()) {
                        return res.status(403).json({ message: "Not authorized to update this product" });
                    }

                    product.isCompleted = !product.isCompleted;
                    await product.save();

                    res.status(200).json(product);
                } catch (error) {
                    res.status(500).json({ message: error.message });
                }
            };