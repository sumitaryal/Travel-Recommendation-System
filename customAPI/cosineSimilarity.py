import numpy as np

def cosine_similarity(matrix):
    """
    Compute cosine similarity between each pair of rows in the input matrix.
    
    Parameters:
    -----------
    matrix : numpy array
        Input matrix of shape (n_samples, n_features).
    
    Returns:
    --------
    numpy array
        Cosine similarity matrix of shape (n_samples, n_samples).
    """
    # Compute the dot product between all pairs of rows
    dot_product = np.dot(matrix, matrix.T)
    
    # Compute the magnitude (L2 norm) of each row
    row_norms = np.linalg.norm(matrix, axis=1)
    
    # Compute the pairwise product of row norms
    norm_product = np.outer(row_norms, row_norms)
    
    # Compute the cosine similarity matrix
    cos_sim = dot_product / norm_product
    
    return cos_sim