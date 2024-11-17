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
      fullName: 'System Admin',
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
      fullName: 'Regular User',
      email: 'user@example.com',
      phoneNumber: '0987654321',
      department: { connect: { id: adminDepartment.id } },
      role: { connect: { id: userRole.id } }
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
      department: { connect: { id: itDepartment.id } },
      branch: { connect: { id: mainBranch.id } },
      user: { connect: { id: adminUser.id } },
      assetType: { connect: { id: laptopType.id } }
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