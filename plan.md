### ER Diagram

### **1. Identify Entities and Attributes**

Identifed the following primary entities:

1. **Asset**
2. **User**
3. **Department**
4. **Role**
5. **AssetType**
6. **ScrapRequest**
7. **Approval**
8. **ApprovalLevel**

---

#### **Entity Details**

**1. Asset**

Attributes:

- **AssetID** (Primary Key)
- **AssetName**
- **Description**
- **Quantity**
- **DateOfPurchase**
- **PurchaseValue**
- **DepreciationValue**
- **DepartmentID** (Foreign Key to Department)
- **UserID** (Foreign Key to User)
- **AssetUsageStatus** (Enum: In Use, Idle, Scrapped)
- **AssetTypeID** (Foreign Key to AssetType)
- **Remarks**

**2. User**

Attributes:

- **UserID** (Primary Key)
- **Username**
- **Password** (Encrypted)
- **FullName**
- **Email**
- **PhoneNumber**
- **DepartmentID** (Foreign Key to Department)
- **RoleID** (Foreign Key to Role)
- **IsActive**

**3. Department**

Attributes:

- **DepartmentID** (Primary Key)
- **DepartmentName**
- **Region**

**4. Role**

Attributes:

- **RoleID** (Primary Key)
- **RoleName** (e.g., User, Department Manager, IT Manager, Admin Dept Manager, Admin Manager)
- **Description**

**5. AssetType**

Attributes:

- **AssetTypeID** (Primary Key)
- **AssetTypeName** (e.g., IT Asset, Non-IT Asset)
- **Description**

**6. ScrapRequest**

Attributes:

- **ScrapRequestID** (Primary Key)
- **AssetID** (Foreign Key to Asset)
- **RequestedBy** (Foreign Key to User)
- **RequestDate**
- **Reason**
- **CurrentApprovalLevelID** (Foreign Key to ApprovalLevel)
- **Status** (Enum: Pending, Approved, Rejected)
- **Remarks**

**7. Approval**

Attributes:

- **ApprovalID** (Primary Key)
- **ScrapRequestID** (Foreign Key to ScrapRequest)
- **ApprovalLevelID** (Foreign Key to ApprovalLevel)
- **ApproverID** (Foreign Key to User)
- **ApprovalDate**
- **Status** (Enum: Approved, Rejected)
- **Comments**

**8. ApprovalLevel**

Attributes:

- **ApprovalLevelID** (Primary Key)
- **LevelNumber** (Indicates the order in the approval process)
- **RoleID** (Foreign Key to Role)
- **AssetTypeID** (Foreign Key to AssetType)
- **NextLevelID** (Foreign Key to ApprovalLevel, nullable)
- **Description**

---

### **2. Relationships**

Relationships between these entities.

- **Asset** is **assigned to** a **User** and a **Department**.
  - `Asset.UserID` → `User.UserID`
  - `Asset.DepartmentID` → `Department.DepartmentID`
  - `Asset.AssetTypeID` → `AssetType.AssetTypeID`

- **User** belongs to a **Department** and has a **Role**.
  - `User.DepartmentID` → `Department.DepartmentID`
  - `User.RoleID` → `Role.RoleID`

- **ScrapRequest** is **created by** a **User** for an **Asset**.
  - `ScrapRequest.AssetID` → `Asset.AssetID`
  - `ScrapRequest.RequestedBy` → `User.UserID`
  - `ScrapRequest.CurrentApprovalLevelID` → `ApprovalLevel.ApprovalLevelID`

- **Approval** is **made by** a **User** (Approver) for a **ScrapRequest** at a specific **ApprovalLevel**.
  - `Approval.ScrapRequestID` → `ScrapRequest.ScrapRequestID`
  - `Approval.ApproverID` → `User.UserID`
  - `Approval.ApprovalLevelID` → `ApprovalLevel.ApprovalLevelID`

- **ApprovalLevel** defines the **Role** required to approve a **ScrapRequest** for a specific **AssetType**.
  - `ApprovalLevel.RoleID` → `Role.RoleID`
  - `ApprovalLevel.AssetTypeID` → `AssetType.AssetTypeID`
  - `ApprovalLevel.NextLevelID` → `ApprovalLevel.ApprovalLevelID` (self-referencing)

---

### **3. Explanation of the Approval Workflow**

The approval workflow differs based on the AssetType (IT or Non-IT). The `ApprovalLevel` entity allows us to model this dynamic workflow.

#### **Approval Levels for Non-IT Assets**

1. **Level 1**
   - **LevelNumber**: 1
   - **RoleID**: Department Manager 
   - **AssetTypeID**: Non-IT Asset
   - **NextLevelID**: Points to Level 2

2. **Level 2**
   - **LevelNumber**: 2
   - **RoleID**: Admin Dept Manager 
   - **AssetTypeID**: Non-IT Asset
   - **NextLevelID**: Points to Level 3

3. **Level 3**
   - **LevelNumber**: 3
   - **RoleID**: Admin Manager
   - **AssetTypeID**: Non-IT Asset
   - **NextLevelID**: Null (end of workflow)

#### **Approval Levels for IT Assets**

1. **Level 1**
   - **LevelNumber**: 1
   - **RoleID**: Department Manager 
   - **AssetTypeID**: IT Asset
   - **NextLevelID**: Points to Level 2

2. **Level 2**
   - **LevelNumber**: 2
   - **RoleID**: IT Manager 
   - **AssetTypeID**: IT Asset
   - **NextLevelID**: Points to Level 3

3. **Level 3**
   - **LevelNumber**: 3
   - **RoleID**: Admin Dept Manager 
   - **AssetTypeID**: IT Asset
   - **NextLevelID**: Points to Level 4

4. **Level 4**
   - **LevelNumber**: 4
   - **RoleID**: Admin Manager
   - **AssetTypeID**: IT Asset
   - **NextLevelID**: Null (end of workflow)

---

### **4. How the Workflow Operates**

- **When a User submits a ScrapRequest:**
  - The system identifies the `AssetType` of the asset.
  - It retrieves the first `ApprovalLevel` for that `AssetType` (LevelNumber = 1).
  - The `CurrentApprovalLevelID` in `ScrapRequest` is set to this level.

- **Approval Process:**
  - **Approver**: A User whose `RoleID` matches the `RoleID` in `ApprovalLevel` and is associated with the relevant Department/Region.
  - The Approver reviews the `ScrapRequest` and records their decision in the `Approval` entity.
  - If **Approved**:
    - The system checks the `NextLevelID` in `ApprovalLevel`.
    - If there is a `NextLevelID`, the `CurrentApprovalLevelID` in `ScrapRequest` is updated to this next level.
    - The process repeats with the next Approver.
  - If **Rejected**:
    - The `Status` in `ScrapRequest` is set to **Rejected**.
    - The process ends, and the User is notified.

- **Completion:**
  - When the final level Approver approves the request (where `NextLevelID` is null), the `Status` in `ScrapRequest` is set to **Approved**.
  - The `AssetUsageStatus` in `Asset` is updated to **Scrapped**.

---

### **5. Summary of Relationships**

- **One-to-Many Relationships:**
  - **Department** to **User**: One Department has many Users.
  - **Department** to **Asset**: One Department has many Assets.
  - **Role** to **User**: One Role can be assigned to many Users.
  - **AssetType** to **Asset**: One AssetType classifies many Assets.
  - **AssetType** to **ApprovalLevel**: One AssetType has many ApprovalLevels.
  - **ScrapRequest** to **Approval**: One ScrapRequest has many Approvals.

- **Many-to-One Relationships:**
  - **Asset** to **User**: Many Assets can be managed by one User.
  - **Asset** to **Department**: Many Assets belong to one Department.
  - **User** to **Department**: Many Users belong to one Department.
  - **User** to **Role**: Many Users have one Role.

- **Self-Referencing Relationship:**
  - **ApprovalLevel** to **ApprovalLevel**: Defines the sequence in the approval process via `NextLevelID`.

---

### **6. Incorporating the Excel Template Fields**

Let's map the Excel template columns to the attributes in our entities.

#### **For Non-IT Assets**

- **编号 (Asset ID)** → `Asset.AssetID`
- **资产名称 (Asset Name)** → `Asset.AssetName`
- **简单描述 (Description)** → `Asset.Description`
- **数量 (Quantity)** → `Asset.Quantity`
- **购置时间 (Time of Acquisition)** → `Asset.DateOfPurchase`
- **购入原值 (Purchase Original Value)** → `Asset.PurchaseValue`
- **折旧值 (Depreciation Value)** → `Asset.DepreciationValue`
- **使用部门/区域 (Department/Region)** → `Asset.DepartmentID` (join with `Department`)
- **使用人/负责人 (User/Person in Charge)** → `Asset.UserID` (join with `User`)
- **资产使用情况 (Asset Usage Status)** → `Asset.AssetUsageStatus` (Enum: In Use, Idle, Scrapped)
- **备注 (Remarks)** → `Asset.Remarks`

#### **For IT Assets**

Same mapping applies, ensuring consistency across asset types.

---

### **8. Additional Considerations**

- **Enum Fields:**
  - **AssetUsageStatus** in `Asset`: Enum values are **In Use**, **Idle**, **Scrapped**.
  - **Status** in `ScrapRequest` and `Approval`: Enum values are **Pending**, **Approved**, **Rejected**.

- **User Roles and Permissions:**
  - Assign permissions based on `RoleID` to control access to different pages (e.g., Admin Dashboard, Approval Pages).

- **Audit Trails:**
  - Consider adding an **AuditLog** entity to track changes to critical entities like `Asset` and `ScrapRequest`.

---

### **9. Next Steps**

- **Create Physical ER Diagram:**
  - Use a database modeling tool (e.g., MySQL Workbench, Microsoft Visio, or draw.io) to create the visual ER diagram.
  - Represent entities as tables with their attributes.
  - Draw lines to indicate relationships (one-to-many, many-to-one, etc.), specifying foreign keys.

- **Validate the Model:**
  - Ensure all required data is captured.
  - Verify that relationships accurately represent the business logic.
  - Check for normalization to eliminate data redundancy.

- **Implement the Database Schema:**
  - Based on the ER diagram, write SQL scripts to create the tables and relationships in your chosen database system.

---

**Example of How Entities Relate in the ER Diagram:**

- **Asset** ← (belongs to) **Department**
- **Asset** ← (assigned to) **User**
- **Asset** → (classified by) **AssetType**
- **ScrapRequest** ← (for) **Asset**
- **ScrapRequest** ← (created by) **User**
- **ScrapRequest** → (has many) **Approvals**
- **Approval** ← (made by) **User**
- **Approval** ← (at) **ApprovalLevel**
- **ApprovalLevel** ← (requires) **Role**
- **ApprovalLevel** ← (for) **AssetType**
- **User** ← (has) **Role**
- **User** ← (belongs to) **Department**

---
