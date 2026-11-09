import { motion } from 'framer-motion';

const BankAnimation = () => {
  return (
    <div style={{ position: 'absolute', left: '8%', bottom: '15%', zIndex: 1, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Roof (Triangle) */}
        <div style={{ width: '0', height: '0', borderLeft: '80px solid transparent', borderRight: '80px solid transparent', borderBottom: '50px solid #E2B657' }}></div>
        
        {/* Main Building */}
        <div style={{ background: '#FFF', width: '140px', height: '100px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: '10px', borderLeft: '4px solid #DBA030', borderRight: '4px solid #DBA030' }}>
          {/* Pillars */}
          <div style={{ width: '12px', height: '80px', background: '#F9D989', borderRadius: '4px' }}></div>
          <div style={{ width: '12px', height: '80px', background: '#F9D989', borderRadius: '4px' }}></div>
          <div style={{ width: '12px', height: '80px', background: '#F9D989', borderRadius: '4px' }}></div>
          <div style={{ width: '12px', height: '80px', background: '#F9D989', borderRadius: '4px' }}></div>
        </div>
        
        {/* Base */}
        <div style={{ background: '#DBA030', width: '180px', height: '20px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>
          FINBIT BANK
        </div>
        
        {/* Stairs */}
        <div style={{ width: '200px', height: '10px', background: '#E5E5E5', marginTop: '2px', borderRadius: '2px' }}></div>
        <div style={{ width: '220px', height: '10px', background: '#D4D4D4', marginTop: '2px', borderRadius: '2px' }}></div>
        
        {/* Glowing Door */}
        <motion.div 
          animate={{ boxShadow: ['0 0 10px #F2C879', '0 0 20px #F2C879', '0 0 10px #F2C879'] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '22px', width: '30px', height: '40px', background: '#333', borderRadius: '15px 15px 0 0' }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default BankAnimation;
