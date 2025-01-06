const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.$transaction([
    prisma.approval.deleteMany(),
    prisma.scrapRequest.deleteMany(),
    prisma.assetDepreciation.deleteMany(),
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
      description: 'Portable computers',
      depreciationPercentage: 10
    }
  })

  const desktopType = await prisma.assetType.create({
    data: {
      assetTypeName: 'Desktop',
      description: 'Desktop computers',
      depreciationPercentage: 10
    }
  })

  const printerType = await prisma.assetType.create({
    data: {
      assetTypeName: 'Printer',
      description: 'Printers',
      depreciationPercentage: 5
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

  // Create an asset with initial depreciation record
  const desktop = await prisma.asset.create({
    data: {
      assetName: 'Dell Workstation',
      description: 'Dell Precision Tower',
      quantity: 1,
      company: 'Dell Technologies',
      location: 'Admin Office',
      assetCategory: 'Electronics',
      vendorName: 'Dell Enterprise Sales',
      billDate: new Date('2024-01-15'),
      billNumber: 'BILL2024002',
      openingBalance: 1500.00,
      addition: 0.00,
      wdv: 1400.00,
      assetUsage: 'Administrative Tasks',
      assetUsageStatus: 'IN_USE',
      remarks: 'High-performance workstation',
      department: { connect: { id: adminDepartment.id } },
      branch: { connect: { id: mainBranch.id } },
      user: { connect: { id: regularUser.id } },
      assetType: { connect: { id: desktopType.id } },
      // Add initial depreciation record
      depreciations: {
        create: {
          year: 2024,
          openingBalance: 1500.00,
          addition: 0.00,
          depreciation: 100.00,
          wdv: 1400.00,
          cumulativeDepreciation: 100.00,
          calculatedAt: new Date('2024-01-15')
        }
      }
    }
  });

  // Create another asset with multiple depreciation records
  const laptop = await prisma.asset.create({
    data: {
      assetName: 'MacBook Pro',
      description: 'MacBook Pro 16-inch',
      quantity: 1,
      company: 'Apple Inc',
      location: 'Development Office',
      assetCategory: 'Electronics',
      vendorName: 'Apple Store',
      billDate: new Date('2023-01-15'), // Note: Previous year
      billNumber: 'BILL2023001',
      openingBalance: 2000.00,
      addition: 0.00,
      wdv: 1600.00,
      assetUsage: 'Development Work',
      assetUsageStatus: 'IN_USE',
      remarks: 'Developer workstation',
      department: { connect: { id: adminDepartment.id } },
      branch: { connect: { id: mainBranch.id } },
      user: { connect: { id: regularUser.id } },
      assetType: { connect: { id: laptopType.id } },
      // Add multiple depreciation records
      depreciations: {
        create: [
          {
            year: 2023,
            openingBalance: 2000.00,
            addition: 0.00,
            depreciation: 200.00,
            wdv: 1800.00,
            cumulativeDepreciation: 200.00,
            calculatedAt: new Date('2023-12-31')
          },
          {
            year: 2024,
            openingBalance: 1800.00,
            addition: 0.00,
            depreciation: 200.00,
            wdv: 1600.00,
            cumulativeDepreciation: 400.00,
            calculatedAt: new Date('2024-01-15')
          }
        ]
      }
    }
  });

  // Create a scrapped asset with depreciation history
  const oldPrinter = await prisma.asset.create({
    data: {
      assetName: 'HP LaserJet',
      description: 'HP LaserJet Pro',
      quantity: 1,
      company: 'HP Inc',
      location: 'Admin Office',
      assetCategory: 'Electronics',
      vendorName: 'HP Store',
      billDate: new Date('2022-01-15'),
      billNumber: 'BILL2022003',
      openingBalance: 1000.00,
      addition: 0.00,
      wdv: 500.00,
      assetUsage: 'Office Printing',
      assetUsageStatus: 'SCRAPPED',
      scrappedAtDate: new Date('2024-01-01'),
      remarks: 'Old printer - replaced with new model',
      department: { connect: { id: adminDepartment.id } },
      branch: { connect: { id: mainBranch.id } },
      user: { connect: { id: regularUser.id } },
      assetType: { connect: { id: printerType.id } },
      // Add depreciation history for scrapped asset
      depreciations: {
        create: [
          {
            year: 2022,
            openingBalance: 1000.00,
            addition: 0.00,
            depreciation: 200.00,
            wdv: 800.00,
            cumulativeDepreciation: 200.00,
            calculatedAt: new Date('2022-12-31')
          },
          {
            year: 2023,
            openingBalance: 800.00,
            addition: 0.00,
            depreciation: 200.00,
            wdv: 600.00,
            cumulativeDepreciation: 400.00,
            calculatedAt: new Date('2023-12-31')
          },
          {
            year: 2024,
            openingBalance: 600.00,
            addition: 0.00,
            depreciation: 100.00, // Partial year depreciation until scrap date
            wdv: 500.00,
            cumulativeDepreciation: 500.00,
            calculatedAt: new Date('2024-01-01')
          }
        ]
      }
    }
  });

  // Create a Scrap Request for the old printer
  const scrapRequest = await prisma.scrapRequest.create({
    data: {
      reason: 'Device is outdated and repair costs exceed value',
      status: 'APPROVED',
      asset: { connect: { id: oldPrinter.id } },
      requestedBy: { connect: { id: regularUser.id } },
      currentApprovalLevel: { connect: { id: level1.id } }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 