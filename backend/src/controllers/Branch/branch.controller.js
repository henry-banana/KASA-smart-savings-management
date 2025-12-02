import { Branch } from "../../models/Branch.js";


export async function getAllBranchName(req, res) {
  try {
    // Lấy tất cả branch
    const result = await Branch.getAll();

    // Lấy tên các branch
    const branchNames = result.map(branch => branch.branchname);

    // Trả về kết quả
    return res.status(200).json({
      message: "Branches retrieved successfully",
      success: true,
      total: branchNames.length,
      data: branchNames
    });

  } catch (err) {
    console.error("❌ Error getting branch name:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve branch name",
      success: false,
    });
  }
}
