const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.$transaction([
    prisma.approval.deleteMany(),
    prisma.scrapRequest.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.approvalLevel.deleteMany(),
    prisma.user.deleteMany(),
    prisma.branch.deleteMany(),
    prisma.department.deleteMany(),
    prisma.role.deleteMany(),
    prisma.assetType.deleteMany(),
  ])

  // Create Branches
  const mainBranch = await prisma.branch.create({
    data: {
      branchName: 'Main Branch',
      location: 'Shanghai'
    }
  })

  // Create Departments
  const itDepartment = await prisma.department.create({
    data: {
      departmentName: 'IT Department',
      region: 'East'
    }
  })

  const adminDepartment = await prisma.department.create({
    data: {
      departmentName: 'Admin Department',
      region: 'East'
    }
  })

  // Create Roles
  const adminRole = await prisma.role.create({
    data: {
      roleName: 'Admin',
      description: 'System Administrator'
    }
  })

  const userRole = await prisma.role.create({
    data: {
      roleName: 'User',
      description: 'Regular User'
    }
  })

  const managerRole = await prisma.role.create({
    data: {
      roleName: 'Manager',
      description: 'Department Manager'
    }
  })

  // Create Asset Types
  const laptopType = await prisma.assetType.create({
    data: {
      assetTypeName: 'Laptop',
      description: 'Portable computers'
    }
  })

  const desktopType = await prisma.assetType.create({
    data: {
      assetTypeName: 'Desktop',
      description: 'Desktop computers'
    }
  })

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Rajesh Kumar',
      email: 'admin@example.com',
      phoneNumber: '1234567890',
      department: { connect: { id: itDepartment.id } },
      role: { connect: { id: adminRole.id } }
    }
  })

  const regularUser = await prisma.user.create({
    data: {
      username: 'user',
      password: await bcrypt.hash('user123', 10),
      fullName: 'Priya Sharma',
      email: 'user@example.com',
      phoneNumber: '0987654321',
      department: { connect: { id: adminDepartment.id } },
      role: { connect: { id: userRole.id } }
    }
  })

  const managerUser = await prisma.user.create({
    data: {
      username: 'manager',
      password: await bcrypt.hash('manager123', 10),
      fullName: 'Amit Patel',
      email: 'manager@example.com',
      phoneNumber: '9876543210',
      department: { connect: { id: itDepartment.id } },
      role: { connect: { id: managerRole.id } }
    }
  })

  // Create Approval Levels
  const level1 = await prisma.approvalLevel.create({
    data: {
      levelNumber: 1,
      description: 'First Level Approval',
      role: { connect: { id: managerRole.id } },
      assetType: { connect: { id: laptopType.id } }
    }
  })

  const level2 = await prisma.approvalLevel.create({
    data: {
      levelNumber: 2,
      description: 'Final Level Approval',
      role: { connect: { id: adminRole.id } },
      assetType: { connect: { id: laptopType.id } },
      previousLevel: { connect: { id: level1.id } }
    }
  })

  // Create Assets
  const laptop = await prisma.asset.create({
    data: {
      assetName: 'MacBook Pro',
      description: 'M1 MacBook Pro 16"',
      serialNumber: 'MBP2024001',
      quantity: 1,
      dateOfPurchase: new Date('2024-01-01'),
      purchaseValue: 2000.00,
      depreciationRate: 0.2,
      usefulLife: 5,
      salvageValue: 500.00,
      currentValue: 1800.00,
      lastDepreciationDate: new Date('2024-03-01'),
      assetUsageStatus: 'IN_USE',
      remarks: 'New laptop for development team',
      company: 'Apple Inc.',
      location: 'Development Office',
      assetCategory: 'Electronics',
      vendorName: 'Apple Store',
      billDate: new Date('2024-01-01'),
      billNumber: 'BILL2024001',
      openingBalance: 2000.00,
      addition: 0.00,
      depreciation: 200.00,
      wdv: 1800.00,
      cumulativeDepreciation: 200.00,
      department: { connect: { id: itDepartment.id } },
      branch: { connect: { id: mainBranch.id } },
      user: { connect: { id: adminUser.id } },
      assetType: { connect: { id: laptopType.id } }
    }
  })

  const desktop = await prisma.asset.create({
    data: {
      assetName: 'Dell Workstation',
      description: 'Dell Precision Tower',
      serialNumber: 'DWS2024001',
      quantity: 1,
      dateOfPurchase: new Date('2024-01-15'),
      purchaseValue: 1500.00,
      depreciationRate: 0.2,
      usefulLife: 5,
      salvageValue: 300.00,
      currentValue: 1400.00,
      lastDepreciationDate: new Date('2024-03-01'),
      assetUsageStatus: 'IN_USE',
      remarks: 'High-performance workstation',
      company: 'Dell Technologies',
      location: 'Admin Office',
      assetCategory: 'Electronics',
      vendorName: 'Dell Enterprise Sales',
      billDate: new Date('2024-01-15'),
      billNumber: 'BILL2024002',
      openingBalance: 1500.00,
      addition: 0.00,
      depreciation: 100.00,
      wdv: 1400.00,
      cumulativeDepreciation: 100.00,
      department: { connect: { id: adminDepartment.id } },
      branch: { connect: { id: mainBranch.id } },
      user: { connect: { id: regularUser.id } },
      assetType: { connect: { id: desktopType.id } }
    }
  })

  // Create a Scrap Request
  const scrapRequest = await prisma.scrapRequest.create({
    data: {
      reason: 'Device is outdated',
      status: 'PENDING',
      asset: { connect: { id: laptop.id } },
      requestedBy: { connect: { id: regularUser.id } },
      currentApprovalLevel: { connect: { id: level1.id } }
    }
  })

  // Create an Approval
  await prisma.approval.create({
    data: {
      status: 'APPROVED',
      comments: 'Approved for scrapping',
      scrapRequest: { connect: { id: scrapRequest.id } },
      approvalLevel: { connect: { id: level1.id } },
      approver: { connect: { id: adminUser.id } }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 